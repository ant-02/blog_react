import { useState, useRef } from "react";
import { Plus, X } from "lucide-react";

interface UploadButtonProps {
  url: string | null;
}

const UploadButton: React.FC<UploadButtonProps> = ({ url }) => {
  const [preview, setPreview] = useState<string | null>(url);
  const [modalOpen, setModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {preview ? (
        <div className="relative inline-flex h-24 w-24 cursor-pointer overflow-hidden rounded-lg border border-border">
          <img
            src={preview}
            alt="preview"
            className="h-full w-full object-cover"
            onClick={() => setModalOpen(true)}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <label className="inline-flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted">
          <Plus className="h-6 w-6" />
          <span className="mt-1 text-xs">缩略图</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      )}

      {modalOpen && preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setModalOpen(false)}
        >
          <img
            src={preview}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
        </div>
      )}
    </>
  );
};

export default UploadButton;
