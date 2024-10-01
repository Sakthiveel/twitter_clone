interface PostCardProps {
  url: string | null;
}
export default function PostCards(postCardInfo: PostCardProps) {
  const { url } = postCardInfo;
  const urlToUse =
    url ||
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
  return (
    <div className="avatar size-10">
      <div className=" rounded-full">
        <img src={urlToUse} className="object-contain" />
      </div>
    </div>
  );
}
