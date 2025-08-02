import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadFile, InvokeLLM } from "@/api/integrations";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Image as ImageIcon, 
  Loader, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw
} from "lucide-react";

export default function DemoLab() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const sampleImageUrl = 'https://images.unsplash.com/photo-1572099613010-6f4a74a1a457?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGljZW5zZSUyMHBsYXRlfGVufDB8fDB8fHww';

  const handleFileChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResults(null);
      setError(null);
    } else {
      setError("Please select a valid image file.");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleUseSampleImage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setResults(null);
      const response = await fetch(sampleImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "sample-license-plate.jpg", { type: "image/jpeg" });
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load the sample image. Please try again.");
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
      const { file_url } = await UploadFile({ file: selectedFile });
      
      const response = await InvokeLLM({
        prompt: "Analyze the provided image to identify the license plate. Extract the license plate number and its corresponding region (State in the US, Country, etc.).",
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "True if a license plate was successfully detected, false otherwise."
            },
            plate_number: {
              type: "string",
              description: "The detected license plate number. Null if not found."
            },
            region: {
              type: "string",
              description: "The state, country, or region of the license plate (e.g., 'California', 'UK'). Null if not found."
            },
            reason: {
              type: "string",
              description: "The reason for failure if success is false (e.g., 'No license plate found in the image', 'Image is too blurry')."
            }
          },
          required: ["success"]
        }
      });

      setResults(response);

    } catch (err) {
      console.error("Analysis failed:", err);
      setError("An unexpected error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Live AI Demo Lab
          </h1>
          <p className="text-xl text-slate-600 mt-4">
            Test our real-time license plate recognition model.
          </p>
        </motion.div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Uploader and Image Preview */}
              <div
                className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition-all duration-300 h-80 flex flex-col items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <AnimatePresence>
                  {previewUrl ? (
                    <motion.img
                      key="preview"
                      src={previewUrl}
                      alt="License Plate Preview"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center"
                    >
                      <Upload className="w-12 h-12 text-slate-400 mb-4" />
                      <p className="font-semibold text-slate-700">Drag & drop an image here</p>
                      <p className="text-sm text-slate-500">or click to select a file</p>
                      <Button variant="link" onClick={(e) => { e.stopPropagation(); handleUseSampleImage(); }} className="mt-4">
                        Use a Sample Image
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Controls and Results */}
              <div className="flex flex-col justify-center h-full">
                {isLoading ? (
                  <div className="text-center">
                    <Loader className="w-12 h-12 text-blue-600 mx-auto animate-spin mb-4" />
                    <p className="text-lg font-semibold text-slate-700">Analyzing image...</p>
                    <p className="text-sm text-slate-500">Our AI is hard at work.</p>
                  </div>
                ) : results ? (
                  <AnimatePresence>
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Analysis Complete</h3>
                    {results.success ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                          <div>
                            <p className="text-sm text-green-700 font-medium">Plate Number</p>
                            <p className="text-2xl font-bold text-green-800 tracking-wider">{results.plate_number}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <ImageIcon className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="text-sm text-blue-700 font-medium">Region</p>
                            <p className="text-2xl font-bold text-blue-800">{results.region}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-8 h-8 text-orange-600" />
                          <div>
                            <p className="text-lg font-semibold text-orange-800">Detection Failed</p>
                            <p className="text-sm text-orange-700">{results.reason || "Could not analyze the image."}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <Button onClick={handleReset} variant="outline" className="w-full mt-6">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Analyze Another Image
                    </Button>
                  </motion.div>
                  </AnimatePresence>
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to Analyze</h3>
                    <p className="text-slate-600 mb-6">
                      Upload an image of a license plate to see our AI model in action. The model will detect and read the characters and identify the region.
                    </p>
                    <Button 
                      onClick={handleAnalyze} 
                      disabled={!selectedFile || isLoading} 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      Analyze Plate
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    {error && (
                      <p className="text-sm text-red-600 mt-4 text-center">{error}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}