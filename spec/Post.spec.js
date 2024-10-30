import prisma from "../src/config/prisma.js";
import PostCtrl from "../src/Controllers/ProjectCtrl.js";

describe("Tests du contrôleur PostCtrl", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jasmine
        .createSpy()
        .and.returnValue({ json: jasmine.createSpy() }),
      json: jasmine.createSpy(),
    };
    next = jasmine.createSpy();
  });

  describe("getPostById", () => {
    it("devrait renvoyer un post existant", async () => {
      req.params = { id: 1 };
      const mockPost = {
        id: 1,
        title: "Test Post",
        description: "Post description",
      };
      spyOn(prisma.post, "findUnique").and.returnValue(
        Promise.resolve(mockPost)
      );

      await PostCtrl.getPostById(req, res, next);

      expect(prisma.post.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it("devrait retourner une erreur 404 si le post n'existe pas", async () => {
      req.params = { id: 999 };
      spyOn(prisma.post, "findUnique").and.returnValue(Promise.resolve(null));

      await PostCtrl.getPostById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({
        message: "Post not found",
      });
    });
  });

  describe("getAllPosts", () => {
    it("devrait renvoyer la liste des posts", async () => {
      const mockPosts = [
        { id: 1, title: "Test Post", description: "Post description" },
      ];
      spyOn(prisma.post, "findMany").and.returnValue(
        Promise.resolve(mockPosts)
      );

      await PostCtrl.getAllPosts(req, res, next);

      expect(prisma.post.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });
  });

  describe("createPost", () => {
    it("devrait créer un nouveau post", async () => {
      req.body = {
        title: "New Post",
        date_heure: "2024-01-01T00:00:00Z",
        description: "New post description",
        user_id: 1,
        images: ["image1.jpg"],
      };

      const mockNewPost = { id: 1, ...req.body };
      spyOn(prisma.post, "create").and.returnValue(
        Promise.resolve(mockNewPost)
      );

      await PostCtrl.createPost(req, res, next);

      expect(prisma.post.create).toHaveBeenCalledWith({
        data: {
          title: req.body.title,
          date_heure: jasmine.any(Date),
          description: req.body.description,
          user: { connect: { id: req.body.user_id } },
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.status().json).toHaveBeenCalledWith(mockNewPost);
    });
  });

  describe("updatePost", () => {
    it("devrait mettre à jour un post existant", async () => {
      req.params = { id: 1 };
      req.body = {
        title: "Updated Post",
        date_heure: "2024-01-02T00:00:00Z",
        description: "Updated description",
        user_id: 1,
        images: ["image1.jpg"],
      };

      const mockUpdatedPost = { id: 1, ...req.body };
      spyOn(prisma.post, "update").and.returnValue(
        Promise.resolve(mockUpdatedPost)
      );

      await PostCtrl.updatePost(req, res, next);

      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: req.body.title,
          date_heure: jasmine.any(Date),
          description: req.body.description,
          user: { connect: { id: req.body.user_id } },
        },
      });
      expect(res.json).toHaveBeenCalledWith(mockUpdatedPost);
    });

    it("devrait retourner une erreur 404 si le post n'est pas trouvé", async () => {
      req.params = { id: 999 };
      req.body = {
        title: "Non Existant Post",
        description: "This post does not exist",
      };

      spyOn(prisma.post, "update").and.throwError({ code: "P2025" });

      await PostCtrl.updatePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({
        error: "Post not found",
      });
    });
  });

  describe("deletePost", () => {
    it("devrait supprimer un post existant", async () => {
      req.params = { id: 1 };
      const mockDeletedPost = { id: 1, title: "Deleted Post" };
      spyOn(prisma.post, "delete").and.returnValue(
        Promise.resolve(mockDeletedPost)
      );

      await PostCtrl.deletePost(req, res, next);

      expect(prisma.post.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith({
        message: "Post deleted successfully",
        deletedPost: mockDeletedPost,
      });
    });

    it("devrait retourner une erreur 404 si le post n'est pas trouvé pour suppression", async () => {
      req.params = { id: 999 };

      spyOn(prisma.post, "delete").and.throwError({ code: "P2025" });

      await PostCtrl.deletePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({
        error: "Post not found",
      });
    });
  });
});
