import LSBSteg.LSBSteg
import cv2

steg = LSBSteg.LSBSteg.LSBSteg(cv2.imread("a42.jpg"))
img_encoded = steg.encode_text("Asdf test")
cv2.imwrite("new_.png", img_encoded)

#decoding
im = cv2.imread("new_.png")
steg = LSBSteg.LSBSteg.LSBSteg(im)
print("Text value:",steg.decode_text())
