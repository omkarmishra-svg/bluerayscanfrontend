"""
Create test images for deepfake detection testing
"""
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import os

# Create uploads directory if it doesn't exist
os.makedirs("./uploads", exist_ok=True)

# Test Image 1: Simulated "Real" image
print("Creating test_real.jpg...")
real_img = Image.new('RGB', (400, 400), color=(100, 150, 200))
draw = ImageDraw.Draw(real_img)
draw.text((150, 180), "REAL IMAGE", fill=(255, 255, 255))
draw.ellipse([(150, 100), (250, 200)], fill=(220, 180, 140))  # Face-like circle
real_img.save("./uploads/test_real.jpg")
print("✓ Created test_real.jpg")

# Test Image 2: Simulated "Fake/Deepfake" image
print("Creating test_fake.jpg...")
fake_img = Image.new('RGB', (400, 400), color=(200, 100, 100))
draw = ImageDraw.Draw(fake_img)
draw.text((150, 180), "FAKE IMAGE", fill=(255, 255, 0))
draw.ellipse([(150, 100), (250, 200)], fill=(180, 220, 140))  # Different colored face
fake_img.save("./uploads/test_fake.jpg")
print("✓ Created test_fake.jpg")

# Test Image 3: Random noise (to test ML model)
print("Creating test_generated.jpg...")
noise_array = np.random.randint(0, 255, (400, 400, 3), dtype=np.uint8)
noise_img = Image.fromarray(noise_array)
noise_img.save("./uploads/test_generated.jpg")
print("✓ Created test_generated.jpg")

print("\n✅ All test images created successfully!")
print("\nTest images location:")
print(f"  - {os.path.abspath('./uploads/test_real.jpg')}")
print(f"  - {os.path.abspath('./uploads/test_fake.jpg')}") 
print(f"  - {os.path.abspath('./uploads/test_generated.jpg')}")
