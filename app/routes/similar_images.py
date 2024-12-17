import face_recognition
import os


def find_similar_faces(image_folder, target_image_path):
    """
    Find similar faces in a folder compared to a target image
     
    Args:
        image_folder (str): Path to folder containing reference images
        target_image_path (str): Path to the image to match against
    
    Returns:
        list: Paths of similar faces found
    """
    # Load the target image
    target_image = face_recognition.load_image_file(target_image_path)
    target_encoding = face_recognition.face_encodings(target_image)[0]
    
    similar_faces = []
    
    # Iterate through images in the folder
    for filename in os.listdir(image_folder):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            image_path = os.path.join(image_folder, filename)
            
            try:
                # Load and encode each image
                current_image = face_recognition.load_image_file(image_path)
                current_encodings = face_recognition.face_encodings(current_image)
                
                # Compare faces
                for encoding in current_encodings:
                    # Compare face encodings
                    matches = face_recognition.compare_faces([target_encoding], encoding)
                    
                    # If a match is found
                    if matches[0]:
                        similar_faces.append(image_path)
                        break
            
            except Exception as e:
                print(f"Error processing {filename}: {e}")
    
    return similar_faces