"""
ML Model Download and Test Script
Downloads and verifies pretrained models for deepfake detection
"""

import os
import sys

def test_pytorch():
    """Test PyTorch installation"""
    print("=" * 60)
    print("Testing PyTorch Installation...")
    print("=" * 60)
    
    try:
        import torch
        print(f"✓ PyTorch version: {torch.__version__}")
        print(f"✓ CUDA available: {torch.cuda.is_available()}")
        if torch.cuda.is_available():
            print(f"  GPU: {torch.cuda.get_device_name(0)}")
        else:
            print("  Using CPU (slower but works)")
        return True
    except Exception as e:
        print(f"✗ PyTorch not installed or error: {e}")
        return False

def test_transformers():
    """Test Transformers library"""
    print("\n" + "=" * 60)
    print("Testing Transformers Library...")
    print("=" * 60)
    
    try:
        from transformers import pipeline
        print("✓ Transformers library installed")
        return True
    except Exception as e:
        print(f"✗ Transformers not installed: {e}")
        return False

def download_deepfake_model():
    """Download and cache the deepfake detection model"""
    print("\n" + "=" * 60)
    print("Downloading Deepfake Detection Model...")
    print("=" * 60)
    print("Model: umm-maybe/AI-image-detector")
    print("This will download ~400MB and may take a few minutes...")
    
    try:
        from transformers import pipeline
        import torch
        
        # This will download and cache the model
        print("\nDownloading model...")
        pipe = pipeline(
            "image-classification", 
            model="umm-maybe/AI-image-detector",
            device=-1  # Force CPU to ensure compatibility
        )
        
        print("✓ Model downloaded and cached successfully!")
        print(f"✓ Model type: {type(pipe)}")
        
        return pipe
    except Exception as e:
        print(f"✗ Failed to download model: {e}")
        return None

def test_model_inference(pipe):
    """Test the model with a sample image"""
    print("\n" + "=" * 60)
    print("Testing Model Inference...")
    print("=" * 60)
    
    try:
        from PIL import Image
        import numpy as np
        
        # Create a test image (100x100 random noise)
        print("Creating test image...")
        test_array = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
        test_image = Image.fromarray(test_array)
        
        # Run inference
        print("Running inference...")
        results = pipe(test_image)
        
        print("✓ Inference successful!")
        print(f"Results: {results}")
        
        # Interpret results
        top_result = results[0]
        label = top_result['label']
        score = top_result['score']
        
        print(f"\nPrediction: {label}")
        print(f"Confidence: {score * 100:.2f}%")
        
        return True
    except Exception as e:
        print(f"✗ Inference failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main test function"""
    print("\n" + "=" * 60)
    print("ML MODEL SETUP & VERIFICATION")
    print("=" * 60)
    
    # Test PyTorch
    if not test_pytorch():
        print("\n❌ PyTorch is required. Install with: pip install torch")
        return False
    
    # Test Transformers
    if not test_transformers():
        print("\n❌ Transformers is required. Install with: pip install transformers")
        return False
    
    # Download model
    pipe = download_deepfake_model()
    if pipe is None:
        print("\n❌ Model download failed")
        return False
    
    # Test inference
    if not test_model_inference(pipe):
        print("\n❌ Model inference test failed")
        return False
    
    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED!")
    print("=" * 60)
    print("\nThe ML model is ready to use!")
    print("The model will be automatically loaded when you use the deepfake detection API.")
    print("\nBackend will use:")
    print("- Real model if available (93.8% accuracy)")
    print("- Mock predictions if model fails (for demo purposes)")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
