import time, json, subprocess, pathlib, os
from ruyaml import YAML
from rag.retrieve import Retriever
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXP_DIR = ROOT / "data" / "results"
LOG_DIR = ROOT / "data" / "logs"
PROMPTS = ROOT / "experiments" / "prompts"


def read(p):
    return Path(p).read_text(encoding="utf-8")


def run_tests(select=None):
    cmd = ["pytest", "-q"]
    if select:
        cmd.append(select)
    t0 = time.time()
    r = subprocess.run(cmd, capture_output=True, text=True)
    elapsed = time.time() - t0
    return r.returncode == 0, r.stdout + r.stderr, elapsed


def apply_patch(diff_text: str):
    (ROOT / "tmp.patch").write_text(diff_text, encoding="utf-8")
    r = subprocess.run(["git", "apply", "tmp.patch"], cwd=ROOT, capture_output=True, text=True)
    return r.returncode == 0, r.stdout + r.stderr


def llm_call(prompt: str) -> str:
    return ""


def build_prompt(task, use_rag=False):
    sys = read(PROMPTS / ("system_rag.txt" if use_rag else "system_puro.txt"))
    task_tpl = read(PROMPTS / "task_template.txt")
    body = (
        task_tpl.replace("{{title}}", task["title"]).replace("{{goal}}", task["goal"]).replace(
            "{{acceptance}}", ", ".join(task["acceptance"]["tests"])
        )
    )
    if use_rag:
        retriever = Retriever()
        ctx_items = retriever.query(task["goal"], k=6)
        ctx = "\n---\n".join([c["text"] for c in ctx_items])
        sys = sys.replace("{{context}}", ctx)
    return sys + "\n\n" + body


def main(task_file="experiments/tasks/task-001.yaml", mode="puro"):
    YAML_ = YAML(typ="safe")
    task = YAML_.load(read(task_file))
    use_rag = mode == "rag"
    EXP_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    ok0, out0, t0 = run_tests()
    run_log = {
        "task_id": task["id"],
        "mode": mode,
        "pre_tests_ok": ok0,
        "timestamps": {"start": time.time()},
        "iterations": [],
    }

    for i in range(task["limits"]["max_iterations"]):
        prompt = build_prompt(task, use_rag=use_rag)
        answer = llm_call(prompt)
        run_log["iterations"].append({"i": i + 1, "prompt_len": len(prompt), "answer_len": len(answer)})

        if answer.strip():
            ok_applied, out_apply = apply_patch(answer)
            run_log["iterations"][-1]["patch_applied"] = ok_applied
            run_log["iterations"][-1]["apply_log"] = out_apply

        ok, out, dt = run_tests()
        run_log["iterations"][-1]["tests_ok"] = ok
        run_log["iterations"][-1]["pytest_log"] = out
        run_log["iterations"][-1]["test_time_s"] = dt
        if ok:
            break

    run_log["timestamps"]["end"] = time.time()
    (EXP_DIR / f"{task['id']}--{mode}.jsonl").write_text(
        json.dumps(run_log, ensure_ascii=False, indent=2), "utf-8"
    )
    print(f"[{mode}] done -> {task['id']}  tests_ok={ok}")


if __name__ == "__main__":
    import typer

    typer.run(main)


