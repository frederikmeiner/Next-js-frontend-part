export default function Testimonial({ data }) {
  const { quote, authorName, smallimage } = data;

  const imageUrl = smallimage?.formats?.thumbnail?.url
    ? smallimage.formats.thumbnail.url
    : smallimage?.url;

  const altText = smallimage?.alternativeText || authorName || "Forfatterbillede";

  return (
    <div className="bg-red-800 rounded-lg py-6 px-16 pb-20 not-prose mb-24 relative text-center">
      <p className="text-2xl italic text-gray-600">&ldquo;{quote}&rdquo;</p>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        {imageUrl ? (
          <img
            className="w-32 h-32 rounded-full border-4 border-gray-200"
            src={imageUrl}
            alt={altText}
          />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white">
            <span className="text-sm text-gray-400">Ingen billede</span>
          </div>
        )}
        <h4 className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-200 shadow px-3 py-2 text-sm font-bold rounded-full text-gray-800">
          {authorName}
        </h4>
      </div>
    </div>
  );
}
