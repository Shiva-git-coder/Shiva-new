package com.lawyer.config;

import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.Base64;
import java.util.Base64.Decoder;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


@Component
public class DecryptPassword {
	
	@Value("${login.passwordkey}")
	private String passwordkey;
	
	@Value("${login.ivValue}")
	private String ivValue;
	
	public String passwordDecryption(String password) {
        try
        {
            String data = password;
            String key = passwordkey;
            String iv = ivValue;
            
//            System.out.println("originalString data of passwordkey==>"+passwordkey);
//            System.out.println("originalString data of ivValue==>"+ivValue);


//            Decoder decoder = Base64.getDecoder();   
//             byte[] encrypted1 = decoder.decode(data);
            byte[] decodedBytes = Base64.getDecoder().decode(data);


             
            Cipher cipher = Cipher.getInstance("AES/CBC/NoPadding");
            SecretKeySpec keyspec = new SecretKeySpec(key.getBytes(), "AES");
            IvParameterSpec ivspec = new IvParameterSpec(iv.getBytes());

            cipher.init(Cipher.DECRYPT_MODE, keyspec, ivspec);

            byte[] original = cipher.doFinal(decodedBytes);
            String originalString = new String(original);
//            System.out.println("the data of originalString data ==>"+originalString);
            return originalString.trim();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    
		return null;
		
	}
	
	
//	public static void main(String[] args) {
//		 System.out.println("the encrypted password main method===>");
//		try {
//			 String value=encrypt("AES/CBC/NoPadding","1234567812345678",getKeyFromPassword("123456" ,"1234567812345678"),generateIv());
//			 System.out.println("the encrypted password===>"+value);
//		} catch (Exception e) {
//		} 
//	}
	
	public static IvParameterSpec generateIv() {
	    byte[] iv = new byte[] {'1','2','3','4','5','6','7','8','1','2','3','4','5','6','7','8'};
	    new SecureRandom().nextBytes(iv);
	    return new IvParameterSpec(iv);
	}
	
	public static SecretKey getKeyFromPassword(String password, String salt)
		    {
		 SecretKey secret = null;
		try {
			
		    SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
		    KeySpec spec = new PBEKeySpec(password.toCharArray(), salt.getBytes(), 65536, 256);
		     secret = new SecretKeySpec(factory.generateSecret(spec)
		        .getEncoded(), "AES");
			
			} catch (Exception e) {
				e.printStackTrace();
			}
		    return secret;
		}
	
	
	public static String encrypt(String algorithm, String input, SecretKey  key,
		    IvParameterSpec iv) {
		 byte[] cipherText =null;
		    try {
			    Cipher cipher = Cipher.getInstance(algorithm);

				cipher.init(Cipher.ENCRYPT_MODE, key, iv);
				
				 cipherText = cipher.doFinal(input.getBytes());
			} catch (Exception e) {
				e.printStackTrace();
			} 
		   
		    return Base64.getEncoder()
		        .encodeToString(cipherText);
		}

}
