import re


def extract_action_items(text: str) -> list[str]:
    results = []
    for line in text.splitlines():
        original_line = line
        line = line.strip()
        if not line:
            continue
        # Strip leading bullets
        line = re.sub(r'^\s*[-*]\s*', '', line)
        # Check checkbox
        if re.match(r'^\[\s*\]', line):
            content = re.sub(r'^\[\s*\]\s*', '', line).strip()
            results.append(content)
            continue
        # Check keyword
        match = re.match(r'^(todo|action|task|bug|fixme):\s*(.+)', line, re.IGNORECASE)
        if match:
            results.append(match.group(2).strip())
            continue
        # Check exclamation
        if line.endswith('!'):
            results.append(line[:-1].strip())
    return results


