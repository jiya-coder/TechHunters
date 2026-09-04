import Foundation
import Vision
import AppKit

guard CommandLine.arguments.count > 1 else {
    print("Usage: test_ocr <image_path>")
    exit(1)
}

let imagePath = CommandLine.arguments[1]
guard let image = NSImage(contentsOfFile: imagePath),
      let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    print("Could not load image")
    exit(1)
}

let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])
let request = VNRecognizeTextRequest { (request, error) in
    guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
    for observation in observations {
        guard let topCandidate = observation.topCandidates(1).first else { continue }
        let box = observation.boundingBox
        print(String(format: "%.4f,%.4f,%.4f,%.4f|%@", box.origin.x, box.origin.y, box.size.width, box.size.height, topCandidate.string))
    }
}
request.recognitionLevel = .accurate
request.usesLanguageCorrection = false

try requestHandler.perform([request])
