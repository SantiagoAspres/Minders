package com.example;

import java.time.LocalDateTime;

import com.example.feedback.entity.Feedback;
import com.example.feedback.rest.FeedbackResource;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class FeedbackResourceTest {

    @Inject
    FeedbackResource feedbackResource;

    private static final String VALID_API_KEY = "mi-clave-secreta";

    @Test
    public void testSubmitFeedback_Success() {
        Feedback feedback = new Feedback();
        feedback.projectId = "Project-sdk-Import";
        feedback.userId = "user-123";
        feedback.rating = 5;
        feedback.comment = "Excelente!";
        feedback.timestamp = LocalDateTime.now().toString();

        Response response = feedbackResource.submitFeedback(VALID_API_KEY, feedback);

        assertNotNull(response);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

        Feedback returned = (Feedback) response.getEntity();
        assertEquals("Project-sdk-Import", returned.projectId);
        assertEquals("user-123", returned.userId);
        assertEquals(5, returned.rating);
        assertEquals("Excelente!", returned.comment);
    }

    @Test
    public void testSubmitFeedback_InvalidApiKey_ShouldReturn401() {
        Feedback feedback = new Feedback();
        feedback.projectId = "Project-sdk-Import";
        feedback.userId = "user-456";
        feedback.rating = 4;
        feedback.comment = "Comentario válido";
        feedback.timestamp = LocalDateTime.now().toString();

        Response response = feedbackResource.submitFeedback("clave-invalida", feedback);

        assertNotNull(response);
        assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), response.getStatus());
        assertEquals("Invalid API key", response.getEntity());
        System.out.println("Status: " + response.getStatus());
        System.out.println("Entity: " + response.getEntity());
    }

    @Test
    public void testSubmitFeedback_InvalidData_ShouldReturn400() {
        Feedback feedback = new Feedback();
        feedback.projectId = null; // FALTA PROJECT ID
        feedback.userId = "user-789";
        feedback.rating = 6; // FUERA DE RANGO
        feedback.comment = "Datos inválidos";
        feedback.timestamp = LocalDateTime.now().toString();

        Response response = feedbackResource.submitFeedback(VALID_API_KEY, feedback);

        assertNotNull(response);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        assertEquals("Invalid feedback data", response.getEntity());
        System.out.println("Status: " + response.getStatus());
        System.out.println("Entity: " + response.getEntity());
    }
}
