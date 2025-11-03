package com.example.feedback.boundary;

import com.example.feedback.entity.Feedback;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class FeedbackService {

    private final List<Feedback> feedbackList = new ArrayList<>();

    public void saveFeedback(Feedback feedback) {
        feedbackList.add(feedback);
    }

    public List<Feedback> listAll() {
        return feedbackList;
    }
}
