interface PostCardProps {
  url: string | null;
  classes?: string;
}
export default function PostCards(postCardInfo: PostCardProps) {
  const { url, classes } = postCardInfo;
  const urlToUse =
    url ||
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
  console.log({ url });
  return (
    <div className={`avatar size-10 object-center ${classes}`}>
      <div className=" rounded-full">
        <img src={urlToUse} className="object-contain" />
      </div>
    </div>
  );
}
