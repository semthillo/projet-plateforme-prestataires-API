import prisma from "../src/config/prisma.js";
import LinksCtrl from "../src/Controllers/LinksCtrl.js";



describe("LinksCtrl", () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            json: jasmine.createSpy("json"),
            status: jasmine.createSpy("status").and.returnValue({ json: jasmine.createSpy("json") }),
        };
        next = jasmine.createSpy("next");
    });

    afterEach(() => {
       
    });

    describe("getLinkById", () => {
        it("devrait retourner un lien s'il est trouvé", async () => {
            const mockLink = { id: 1, url: "http://example.com", type: "website", user_id: 1 };
            req.params = { id: "1" };
            spyOn(prisma.socialLink, "findUnique").and.returnValue(Promise.resolve(mockLink));

            await LinksCtrl.getLinkById(req, res, next);

            expect(prisma.socialLink.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(res.json).toHaveBeenCalledWith(mockLink);
            expect(res.status).not.toHaveBeenCalledWith(404);
        });

        it("devrait retourner 404 si le lien n'est pas trouvé", async () => {
            req.params = { id: "999" };
            spyOn(prisma.socialLink, "findUnique").and.returnValue(Promise.resolve(null));

            await LinksCtrl.getLinkById(req, res, next);

            expect(prisma.socialLink.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.status().json).toHaveBeenCalledWith({ message: "Link not found" });
        });

        it("devrait retourner 500 s'il y a une erreur serveur", async () => {
            req.params = { id: "1" };
            spyOn(prisma.socialLink, "findUnique").and.throwError("Erreur serveur");

            await LinksCtrl.getLinkById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Server error" });
        });
    });

    describe("getAllLinks", () => {
        it("devrait retourner tous les liens", async () => {
            const mockLinks = [
                { id: 1, url: "http://example.com", type: "website", user_id: 1 },
                { id: 2, url: "http://example.org", type: "blog", user_id: 2 },
            ];
            spyOn(prisma.socialLink, "findMany").and.returnValue(Promise.resolve(mockLinks));

            await LinksCtrl.getAllLinks(req, res, next);

            expect(prisma.socialLink.findMany).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockLinks);
        });

        it("devrait retourner 500 s'il y a une erreur serveur", async () => {
            spyOn(prisma.socialLink, "findMany").and.throwError("Erreur serveur");

            await LinksCtrl.getAllLinks(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Server error" });
        });
    });

    describe("createLink", () => {
        it("devrait créer un nouveau lien", async () => {
            const mockLink = { id: 1, url: "http://example.com", type: "website", user_id: 1 };
            req.body = { url: "http://example.com", type: "website", user_id: 1 };
            spyOn(prisma.socialLink, "create").and.returnValue(Promise.resolve(mockLink));

            await LinksCtrl.createLink(req, res, next);

            expect(prisma.socialLink.create).toHaveBeenCalledWith({
                data: {
                    url: "http://example.com",
                    type: "website",
                    user: { connect: { id: 1 } },
                },
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.status().json).toHaveBeenCalledWith(mockLink);
        });

        it("devrait retourner 500 s'il y a une erreur serveur", async () => {
            req.body = { url: "http://example.com", type: "website", user_id: 1 };
            spyOn(prisma.socialLink, "create").and.throwError("Erreur serveur");

            await LinksCtrl.createLink(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Server error" });
        });
    });

    describe("updateLink", () => {
        it("devrait mettre à jour un lien s'il est trouvé", async () => {
            const mockLink = { id: 1, url: "http://updated.com", type: "website", user_id: 1 };
            req.params = { id: "1" };
            req.body = { url: "http://updated.com", type: "website", user_id: 1 };
            spyOn(prisma.socialLink, "update").and.returnValue(Promise.resolve(mockLink));

            await LinksCtrl.updateLink(req, res, next);

            expect(prisma.socialLink.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    url: "http://updated.com",
                    type: "website",
                    user: { connect: { id: 1 } },
                },
            });
            expect(res.json).toHaveBeenCalledWith(mockLink);
        });

        it("devrait retourner 404 si le lien n'est pas trouvé", async () => {
            req.params = { id: "999" };
            req.body = { url: "http://updated.com", type: "website", user_id: 1 };
            spyOn(prisma.socialLink, "update").and.throwError({ code: "P2025" });

            await LinksCtrl.updateLink(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Link not found" });
        });

        it("devrait retourner 500 s'il y a une erreur serveur", async () => {
            req.params = { id: "1" };
            req.body = { url: "http://updated.com", type: "website", user_id: 1 };
            spyOn(prisma.socialLink, "update").and.throwError("Erreur serveur");

            await LinksCtrl.updateLink(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Server error" });
        });
    });

    describe("deleteLink", () => {
        it("devrait supprimer un lien s'il est trouvé", async () => {
            const mockLink = { id: 1, url: "http://example.com", type: "website", user_id: 1 };
            req.params = { id: "1" };
            spyOn(prisma.socialLink, "delete").and.returnValue(Promise.resolve(mockLink));

            await LinksCtrl.deleteLink(req, res, next);

            expect(prisma.socialLink.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(res.json).toHaveBeenCalledWith({
                message: "Link deleted successfully",
                deletedLink: mockLink,
            });
        });

        it("devrait retourner 404 si le lien n'est pas trouvé", async () => {
            req.params = { id: "999" };
            spyOn(prisma.socialLink, "delete").and.throwError({ code: "P2025" });

            await LinksCtrl.deleteLink(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Link not found" });
        });

        it("devrait retourner 500 s'il y a une erreur serveur", async () => {
            req.params = { id: "1" };
            spyOn(prisma.socialLink, "delete").and.throwError("Erreur serveur");

            await LinksCtrl.deleteLink(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Server error" });
        });
    });
});
