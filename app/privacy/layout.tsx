export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <article
      className="
      prose 
      prose-gray 
      md:prose-base
      lg:prose-lg
      dark:prose-invert
      max-w-4xl 
      mx-auto 
      px-5 
      pt-16 
      pb-[80px]
      prose-headings:font-bold
      prose-a:text-blue-600
      prose-a:no-underline
      hover:prose-a:text-blue-500
      prose-img:rounded-lg
      prose-pre:bg-gray-800
      prose-pre:rounded-lg
    "
    >
      {children}
    </article>
  );
}
