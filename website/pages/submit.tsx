import { useState, ChangeEvent, FormEvent } from "react";
import Editor from "react-simple-code-editor";
// @ts-expect-error TS can't see node_modules/@types/prismjs for some reason
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "@aws-amplify/ui-react";
import { uploadData } from "aws-amplify/storage";

export default function Home() {
  const { user } = useAuthenticator();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("Select a file for upload");
  const [code, setCode] = useState<string>(
    "function add(a, b) {\n return a + b;\n}"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const sendFile = async (file: Blob) => {
    if (isSubmitting) {
      return "Currently submitting file";
    }
    setIsSubmitting(true);
    const now: Date = new Date();
    const formattedTimestamp =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}` +
      `_${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(now.getSeconds()).padStart(2, "0")}`;

    let result: string = "Error";
    try {
      await uploadData({
        path: `code/${user.userId}/${formattedTimestamp}`,
        data: file,
      }).result;
      setIsSubmitting(false);
      result = "File successfully uploaded";
    } catch (error) {
      console.log("Error : ", error);
      result = "Error";
    } finally {
      setIsSubmitting(false);
    }
    return result;
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }
    // sendFile(file);
    setMessage(await sendFile(file));
  };

  const handleCodeUpload = async () => {
    const file = {
      name: "code.js",
      type: "application/javascript",
      content: Buffer.from(code).toString("utf-8"),
    };
    setMessage(await sendFile(new Blob([file.content], { type: file.type })));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>File Upload</h1>
      <form
        onSubmit={handleUpload}
        style={{
          paddingBottom: 20,
        }}
      >
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={isSubmitting}>
          Upload File
        </button>
      </form>
      <p>{message}</p>
      <Editor
        value={code}
        onValueChange={(code) => setCode(code)}
        highlight={(code) => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 20,
          backgroundColor: "white",
        }}
      />

      <Button onClick={handleCodeUpload} disabled={isSubmitting}>
        Upload Code
      </Button>
    </div>
  );
}
