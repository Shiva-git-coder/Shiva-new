package com.lawyer.constants;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class Imageconversion {
	
	@Value("${upload}")
	private String uploadFielPath;

	public String imageConversion(MultipartFile image, String dir) throws IOException {

		String filename = image.getOriginalFilename();
		Path filepath = Paths.get(dir + filename);

		System.out.println(filepath.toString());

		Files.write(filepath, image.getBytes());
		return filepath.toString();
	}

	public void directoryCreation(String directory) throws IOException {

		Path directoryPath = Paths.get(directory);

		Files.createDirectories(directoryPath);

	}
	
	public String imagetoBase64(String dir,String image) throws IOException {
	       String imagePath = uploadFielPath + image;
	       Path imageFilePath = Paths.get(imagePath.trim());
           byte[] imageBytes = Files.readAllBytes(imageFilePath);
           String base64Image = Base64.getEncoder().encodeToString(imageBytes);
           return base64Image;
	}
	

	// for converting byte[] and base64 and we can set the image size
//  public String resizeImageToBase64(String imagePath, int width, int height) throws Exception {
//      // Read the image from the file system
//      BufferedImage originalImage = ImageIO.read(new File(imagePath));
//
//      // Resize the image using Thumbnailator
//      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//      Thumbnails.of(originalImage)
//              .size(width, height)  // Set width and height for resizing
//              .outputFormat("prof.jpg")
//              .toOutputStream(outputStream);
//
//      // Convert the resized image to base64
//      byte[] resizedImageBytes = outputStream.toByteArray();
//      return Base64.getEncoder().encodeToString(resizedImageBytes);
//  }
//
//	
	

}
