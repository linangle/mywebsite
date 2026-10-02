import { Gallery } from "@/components/Gallery";
import { PHOTOS } from "@/photos";

export default function PhotosPage() {
  return (
    <div className="page-body">
      {/* the tab above names the section, so the heading is for readers only */}
      <h1 className="sr-only">photos</h1>
      <Gallery pictures={PHOTOS} />
    </div>
  );
}
