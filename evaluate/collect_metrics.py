import json, subprocess, re, time, pathlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "results"
OUT.mkdir(parents=True, exist_ok=True)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    return r.stdout + r.stderr


def parse_radon(txt):
    m = re.search(r"Average complexity:\s+([A-Z])\s+\(([\d\.]+)\)", txt)
    return {"grade": m.group(1), "score": float(m.group(2))} if m else {}


def main():
    ts = int(time.time())
    report = {"ts": ts}

    ruff_out = run(["ruff", "check", "app"])
    pylint_out = run(["pylint", "app"])
    bandit_out = run(["bandit", "-r", "app", "-q"])
    radon_out = run(["radon", "cc", "app", "-a"])

    report["ruff"] = {"summary": ruff_out.splitlines()[-1] if ruff_out else ""}
    m = re.search(r"Your code has been rated at ([\d\.]+)/10", pylint_out)
    report["pylint_score"] = float(m.group(1)) if m else None
    report["bandit"] = {"raw": bandit_out[:2000]}
    report["radon"] = parse_radon(radon_out)

    (OUT / f"static-metrics-{ts}.json").write_text(json.dumps(report, indent=2), "utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()


