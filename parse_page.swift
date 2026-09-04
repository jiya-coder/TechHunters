import Foundation
import Vision
import AppKit

struct RecognizedText {
    let text: String
    let box: CGRect
}

guard CommandLine.arguments.count > 1 else {
    print("Usage: parse_page <image_path>")
    exit(1)
}

let imagePath = CommandLine.arguments[1]
guard let image = NSImage(contentsOfFile: imagePath),
      let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    print("Could not load image")
    exit(1)
}

let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])
var items: [RecognizedText] = []

let request = VNRecognizeTextRequest { (request, error) in
    guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
    for obs in observations {
        guard let candidate = obs.topCandidates(1).first else { continue }
        items.append(RecognizedText(text: candidate.string, box: obs.boundingBox))
    }
}
request.recognitionLevel = .accurate
request.usesLanguageCorrection = false

try requestHandler.perform([request])

// Sort items primarily by Y descending (top to bottom), then by X ascending (left to right)
items.sort { a, b in
    if abs(a.box.origin.y - b.box.origin.y) > 0.015 {
        return a.box.origin.y > b.box.origin.y
    }
    return a.box.origin.x < b.box.origin.x
}

for item in items {
    print(String(format: "Y:%.4f X:%.4f W:%.4f H:%.4f | %@", item.box.origin.y, item.box.origin.x, item.box.size.width, item.box.size.height, item.text))
}
