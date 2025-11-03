package com.example.feedback.rest;

import com.example.feedback.boundary.FeedbackService;
import com.example.feedback.entity.Feedback;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/feedback")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class FeedbackResource {

    @Inject
    FeedbackService service;

    private static final String API_KEY = "mi-clave-secreta";

    @POST
    public Response submitFeedback(
            @HeaderParam("X-API-Key") String apiKey,
            Feedback feedback) {

        if (!API_KEY.equals(apiKey)) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Invalid API key").build();
        }

        if (feedback.projectId == null || feedback.userId == null || feedback.rating < 1 || feedback.rating > 5) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid feedback data").build();
        }

        service.saveFeedback(feedback);
        return Response.ok().entity(feedback).build();
    }

    @GET
    public Response listFeedbacks(@HeaderParam("X-API-Key") String apiKey) {
        if (!API_KEY.equals(apiKey)) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Invalid API key").build();
        }
        return Response.ok(service.listAll()).build();
    }
}