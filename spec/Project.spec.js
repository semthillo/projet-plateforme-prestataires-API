import prisma from "../src/config/prisma.js";
import ProjectCtrl from "../src/Controllers/ProjectCtrl.js";

describe("Tests du contrôleur ProjectCtrl", () => {
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

  describe("getProjectById", () => {
    it("devrait renvoyer un projet existant", async () => {
      req.params = { id: 1 };
      const mockProject = {
        id: 1,
        title: "Test Project",
        description: "Project description",
        user: { id: 1, name: "User Test" },
        images: [{ id: 1, name: "image1.jpg" }]
      };
      spyOn(prisma.project, "findUnique").and.returnValue(
        Promise.resolve(mockProject)
      );

      await ProjectCtrl.getProjectById(req, res, next);

      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { user: true, images: true },
      });
      expect(res.json).toHaveBeenCalledWith(mockProject);
    });

    it("devrait retourner une erreur 404 si le projet n'existe pas", async () => {
      req.params = { id: 999 };
      spyOn(prisma.project, "findUnique").and.returnValue(Promise.resolve(null));

      await ProjectCtrl.getProjectById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({
        message: "Project not found",
      });
    });
  });

  describe("getAllProjects", () => {
    it("devrait renvoyer la liste des projets", async () => {
      const mockProjects = [
        { id: 1, title: "Test Project", description: "Project description" },
      ];
      spyOn(prisma.project, "findMany").and.returnValue(
        Promise.resolve(mockProjects)
      );

      await ProjectCtrl.getAllProjects(req, res, next);

      expect(prisma.project.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockProjects);
    });
  });

  describe("createProject", () => {
    it("devrait créer un nouveau projet", async () => {
      req.body = {
        title: "New Project",
        date_heure: "2024-01-01T00:00:00Z",
        description: "New project description",
        user_id: 1,
        images: ["image1.jpg"],
      };

      const mockNewProject = { id: 1, ...req.body };
      spyOn(prisma.project, "create").and.returnValue(
        Promise.resolve(mockNewProject)
      );

      await ProjectCtrl.createProject(req, res, next);

      expect(prisma.project.create).toHaveBeenCalledWith({
        data: {
          title: req.body.title,
          date_heure: jasmine.any(Date),
          description: req.body.description,
          user: { connect: { id: req.body.user_id } },
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.status().json).toHaveBeenCalledWith(mockNewProject);
    });
  });

  describe("updateProject", () => {
    it("devrait mettre à jour un projet existant", async () => {
      req.params = { id: 1 };
      req.body = {
        title: "Updated Project",
        date_heure: "2024-01-02T00:00:00Z",
        description: "Updated description",
        user_id: 1,
        images: ["image1.jpg"],
      };

      const mockUpdatedProject = { id: 1, ...req.body };
      spyOn(prisma.project, "update").and.returnValue(
        Promise.resolve(mockUpdatedProject)
      );

      await ProjectCtrl.updateProject(req, res, next);

      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: req.body.title,
          date_heure: jasmine.any(Date),
          description: req.body.description,
          user: { connect: { id: req.body.user_id } },
        },
      });
      expect(res.json).toHaveBeenCalledWith(mockUpdatedProject);
    });

    it("devrait retourner une erreur 404 si le projet n'est pas trouvé", async () => {
      req.params = { id: 999 };
      req.body = {
        title: "Non Existant Project",
        description: "This project does not exist",
      };

      spyOn(prisma.project, "update").and.throwError({ code: "P2025" });

      await ProjectCtrl.updateProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({
        error: "Project not found",
      });
    });
  });

  describe("deleteProject", () => {
    it("devrait supprimer un projet existant", async () => {
      req.params = { id: 1 };
      const mockDeletedProject = { id: 1, title: "Deleted Project" };
      spyOn(prisma.project, "delete").and.returnValue(
        Promise.resolve(mockDeletedProject)
      );

      await ProjectCtrl.deleteProject(req, res, next);

      expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith({
        message: "Project deleted successfully",
        deletedProject: mockDeletedProject,
      });
    });

    it("devrait retourner une erreur 404 si le projet n'est pas trouvé pour suppression", async () => {
      req.params = { id: 999 };

      spyOn(prisma.project, "delete").and.throwError({ code: "P2025" });

      await ProjectCtrl.deleteProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({
        error: "Project not found",
      });
    });
  });
});
