from PIL import Image, ImageDraw, ImageFont
import os

# Create public folder path
public_path = r'c:\Users\Pragathini\Desktop\DMK website\public'

# Create img1.jpg - Student Meetup
img1 = Image.new('RGB', (800, 600), color='#FF6B35')
draw1 = ImageDraw.Draw(img1)
draw1.text((250, 260), "Student Meetup", fill='white')
draw1.text((240, 320), "Tamil Maanavar Mandram", fill='white')
img1.save(os.path.join(public_path, 'img1.jpg'))
print("Created img1.jpg")

# Create img2.jpg - Cultural Program  
img2 = Image.new('RGB', (800, 600), color='#4ECDC4')
draw2 = ImageDraw.Draw(img2)
draw2.text((220, 260), "Cultural Program", fill='white')
draw2.text((200, 320), "Tamil Heritage Celebration", fill='white')
img2.save(os.path.join(public_path, 'img2.jpg'))
print("Created img2.jpg")

print("All images created successfully!")
