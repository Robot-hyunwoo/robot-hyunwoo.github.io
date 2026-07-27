// Convert ```mermaid fenced code blocks into raw <pre class="mermaid"> nodes
// BEFORE expressive-code processes them, so the client-side renderer can turn
// them into diagrams instead of showing highlighted source.
function escapeHtml(s) {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

export function remarkMermaid() {
	return (tree) => {
		const walk = (node) => {
			if (!node || !Array.isArray(node.children)) return;
			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];
				if (child.type === "code" && child.lang === "mermaid") {
					node.children[i] = {
						type: "html",
						value: `<pre class="mermaid not-prose">${escapeHtml(child.value)}</pre>`,
					};
				} else {
					walk(child);
				}
			}
		};
		walk(tree);
	};
}
