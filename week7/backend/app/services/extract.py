import re


def extract_action_items(text: str) -> list[str]:
    patterns = [
        r'(?i)(todo|action|task|fixme):\s*(.*)',
        r'- \[[ x]\]\s*(.*)',
        r'\[[ x]\]\s*(.*)',
    ]
    results = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.MULTILINE)
        for match in matches:
            if isinstance(match, tuple):
                text_part = match[-1].strip()
            else:
                text_part = match.strip()
            if text_part:
                results.append(text_part)
    return results


