import prisma from "../src/config/prisma.js";
import UserCtrl from "../src/Controllers/UserCtrl.js";

describe("Tests du contrôleur UserCtrl", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() }),
      json: jasmine.createSpy(),
    };
    next = jasmine.createSpy();
  });

  describe("getUserById", () => {
    it("devrait renvoyer un utilisateur existant", async () => {
      req.params = { id: 1 };
      const mockUser = { id: 1, name: "John Doe", email: "john@example.com" };
      spyOn(prisma.user, "findUnique").and.returnValue(Promise.resolve(mockUser));

      await UserCtrl.getUserById(req, res, next);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("devrait retourner une erreur 404 si l'utilisateur n'existe pas", async () => {
      req.params = { id: 999 };
      spyOn(prisma.user, "findUnique").and.returnValue(Promise.resolve(null));

      await UserCtrl.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  describe("getAllUsers", () => {
    it("devrait renvoyer la liste des utilisateurs", async () => {
      const mockUsers = [{ id: 1, name: "John Doe", email: "john@example.com" }];
      spyOn(prisma.user, "findMany").and.returnValue(Promise.resolve(mockUsers));

      await UserCtrl.getAllUsers(req, res, next);

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe("createUser", () => {
    it("devrait créer un nouvel utilisateur", async () => {
      req.body = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "USER",
        address: "123 Street",
        telephone: "123456789",
        description: "A user",
        hours: "9am-5pm",
      };

      const mockNewUser = { id: 1, ...req.body };
      spyOn(prisma.user, "create").and.returnValue(Promise.resolve(mockNewUser));

      await UserCtrl.createUser(req, res, next);

      expect(prisma.user.create).toHaveBeenCalledWith({ data: req.body });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.status().json).toHaveBeenCalledWith(mockNewUser);
    });

    it("devrait retourner une erreur si l'email existe déjà", async () => {
      req.body = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };
      spyOn(prisma.user, "create").and.throwError(new Error("Email already exists"));

      await UserCtrl.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.status().json).toHaveBeenCalledWith({ error: "Email already exists" });
    });
  });

  describe("updateUser", () => {
    it("devrait mettre à jour un utilisateur existant", async () => {
      req.params = { id: 1 };
      req.body = {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "newpassword",
        role: "ADMIN",
        address: "456 Street",
        telephone: "987654321",
        description: "Updated user",
        hours: "10am-6pm",
      };

      const mockUpdatedUser = { id: 1, ...req.body };
      spyOn(prisma.user, "update").and.returnValue(Promise.resolve(mockUpdatedUser));

      await UserCtrl.updateUser(req, res, next);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: req.body,
      });
      expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it("devrait retourner une erreur 404 si l'utilisateur n'est pas trouvé", async () => {
      req.params = { id: 999 };
      req.body = { name: "Non Existant", email: "nonexistant@example.com" };

      spyOn(prisma.user, "update").and.throwError({ code: "P2025" });

      await UserCtrl.updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  describe("deleteUser", () => {
    it("devrait supprimer un utilisateur existant", async () => {
      req.params = { id: 1 };
      const mockDeletedUser = { id: 1, name: "John Doe", email: "john@example.com" };
      spyOn(prisma.user, "delete").and.returnValue(Promise.resolve(mockDeletedUser));

      await UserCtrl.deleteUser(req, res, next);

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith({
        message: "User deleted successfully",
        deletedUser: mockDeletedUser,
      });
    });

    it("devrait retourner une erreur 404 si l'utilisateur n'est pas trouvé pour suppression", async () => {
      req.params = { id: 999 };

      spyOn(prisma.user, "delete").and.throwError({ code: "P2025" });

      await UserCtrl.deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });
});
