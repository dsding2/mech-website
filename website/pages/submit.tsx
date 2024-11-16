import { useState, ChangeEvent, FormEvent } from "react";
import Editor from "react-simple-code-editor";
// @ts-expect-error TS can't see node_modules/@types/prismjs for some reason
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { Button } from "@aws-amplify/ui-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("Select a file for upload");
  const [code, setCode] = useState<string>(
    "function add(a, b) {\n return a + b;\n}"
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("File uploaded successfully!");
      } else {
        setMessage("File upload failed.");
      }
    } catch {
      setMessage("An error occurred while uploading the file.");
    }
  };

  const handleCodeUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("File uploaded successfully!");
      } else {
        setMessage("File upload failed.");
      }
    } catch {
      setMessage("An error occurred while uploading the file.");
    }
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
        <button type="submit">Upload File</button>
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

      <Button onClick={handleCodeUpload}>Upload Code</Button>
    </div>
  );
}
