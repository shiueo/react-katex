import KaTeXComponent from '@shiueo/react-katex';

interface LatexRendererProps {
	inline?: boolean;
	children: string;
}

export function LatexRenderer({ inline = false, children }: LatexRendererProps) {
	return <KaTeXComponent block={!inline} math={children} />
}