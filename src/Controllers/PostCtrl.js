import prisma from "../config/prisma.js";

class PostCtrl {

    // Récupérer un post par ID
    static async getPostById(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);  
            const result = await prisma.post.findUnique({
                where: {
                    id: id,  
                },
                // include: { user: true, images: true }  // Inclure les relations User et Images
            });

            if (!result) {
                return res.status(404).json({ message: "Post not found" });
            }

            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    // Récupérer tous les posts
    static async getAllPosts(_req, res, next) {
        try {
            const result = await prisma.post.findMany({
                // include: { user: true, images: true }  // Inclure les relations User et Images
            });
            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

   
    static async createPost(req, res, next) {
        try {
            const { title, date_heure, description, user_id, images=[] } = req.body;

            const newPost = await prisma.post.create({
                data: {
                    title: title,
                    date_heure: new Date(date_heure),
                    description: description,
                    user: { connect: { id: user_id } },
                    
                },
            });

            for (let i = 0; i < images.length; i++) {
                const newImage = await prisma.images.create({
                data: {
                    name: images[i]
                }
            })
                const postImage = await prisma.toContain.create({
                    data: {
                        post_id: newPost.id,
                        image_id: newImage.id
                    }
                })
            
            }
            

            res.status(201).json(newPost);

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

  
    static async updatePost(req, res, next) {
        try {
            // Convertir l'ID en entier
            const id = parseInt(req.params.id, 10);
    
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid ID format" });
            }
    
            const { title, date_heure, description, user_id, images = [] } = req.body;
    
            // Mettre à jour le post principal
            const updatedPost = await prisma.post.update({
                where: { id: id },
                data: {
                    title: title,
                    date_heure: new Date(date_heure),
                    description: description,
                    user: { connect: { id: user_id } },
                },
            });
    
            // Supprimer les anciennes relations d'images
            await prisma.toContain.deleteMany({
                where: { post_id: updatedPost.id }
            });
    
            // Ajouter ou mettre à jour les images et relations
            for (let i = 0; i < images.length; i++) {
                const imageName = images[i];
    
                // Vérifier si l'image existe déjà
                const existingImage = await prisma.images.findUnique({
                    where: { name: imageName }
                });
    
                let imageId;
    
                if (existingImage) {
                    // Mettre à jour l'image existante
                    const updatedImage = await prisma.images.update({
                        where: { id: existingImage.id },
                        data: { name: imageName }
                    });
                    imageId = updatedImage.id;
                } else {
                    // Créer une nouvelle image si elle n'existe pas
                    const newImage = await prisma.images.create({
                        data: { name: imageName }
                    });
                    imageId = newImage.id;
                }
    
                // Ajouter la relation entre le post et l'image
                await prisma.toContain.create({
                    data: {
                        post_id: updatedPost.id,
                        image_id: imageId
                    }
                });
            }
    
            res.json(updatedPost);
        } catch (error) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: "Post not found" });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }
    
    
    

    // Supprimer un post
    static async deletePost(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);  

            const deletedPost = await prisma.post.delete({
                where: { id: id },
            });

            res.json({ message: "Post deleted successfully", deletedPost });
        } catch (error) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: "Post not found" });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }

}

export default PostCtrl;
