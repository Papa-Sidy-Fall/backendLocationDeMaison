import { Router } from "express";
import { z } from "zod";
import { getAuthContext, requireAuth } from "../middlewares/auth.js";
import { deleteUploadedPropertyImages, getUploadedPropertyImagePaths, uploadPropertyImages, } from "../middlewares/upload.js";
import { propertyIdParamSchema, propertyQuerySchema, publishPropertySchema } from "../schemas/property.schema.js";
import { AppError } from "../utils/app-error.js";
import { getPropertyById, getSimilarProperties, listProperties, publishProperty, } from "../services/property.service.js";
export const propertyRouter = Router();
propertyRouter.get("/", async (req, res) => {
    const query = propertyQuerySchema.parse(req.query);
    const result = await listProperties(query);
    res.json({
        success: true,
        data: result,
    });
});
propertyRouter.get("/:id", async (req, res) => {
    const params = propertyIdParamSchema.parse(req.params);
    const property = await getPropertyById(params.id);
    res.json({
        success: true,
        data: property,
    });
});
propertyRouter.get("/:id/similar", async (req, res) => {
    const params = propertyIdParamSchema.parse(req.params);
    const query = z
        .object({
        limit: z.coerce.number().int().min(1).max(20).optional().default(3),
    })
        .parse(req.query);
    const similarProperties = await getSimilarProperties(params.id, query.limit);
    res.json({
        success: true,
        data: similarProperties,
    });
});
propertyRouter.post("/", requireAuth, uploadPropertyImages, async (req, res, next) => {
    const authContext = getAuthContext(res);
    try {
        const payload = publishPropertySchema.parse(req.body);
        const uploadedImagePaths = getUploadedPropertyImagePaths(req);
        const allImageUrls = [...payload.imageUrls, ...uploadedImagePaths];
        if (allImageUrls.length < 1) {
            throw new AppError("At least one image is required", 400);
        }
        if (allImageUrls.length > 5) {
            throw new AppError("You can upload a maximum of 5 images", 400);
        }
        const property = await publishProperty({
            propertyType: payload.propertyType,
            title: payload.title,
            description: payload.description,
            imageUrls: allImageUrls,
            price: payload.price,
            location: payload.location,
            exactAddress: payload.exactAddress,
            quartier: payload.quartier,
            bedrooms: payload.bedrooms,
            bathrooms: payload.bathrooms,
            area: payload.area,
            ownerEmail: authContext.email,
            features: payload.features,
        });
        res.status(201).json({
            success: true,
            message: "Property published and pending approval",
            data: property,
        });
    }
    catch (error) {
        deleteUploadedPropertyImages(req);
        next(error);
    }
});
//# sourceMappingURL=property.routes.js.map