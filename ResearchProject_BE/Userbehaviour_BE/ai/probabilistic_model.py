# probabilistic_model.py
import torch
import torch.nn as nn
import torch.optim as optim

class SimpleBayesianNetwork(nn.Module):
    def __init__(self):
        super(SimpleBayesianNetwork, self).__init__()
        # Simple feed-forward layers for Bayesian-like logic
        self.layer1 = nn.Linear(2, 10)  # Input size 2 (zoom and font), output size 10
        self.layer2 = nn.Linear(10, 1)  # Output size 1 (predicted adjustment)

    def forward(self, x):
        x = torch.relu(self.layer1(x))
        x = self.layer2(x)
        return x

def build_bayesian_network():
    model = SimpleBayesianNetwork()
    return model

def make_prediction(model, zoom_level, font_size):
    # Input: [zoom_level, font_size]
    input_data = torch.tensor([[zoom_level, font_size]], dtype=torch.float32)
    output = model(input_data)
    return output.item()  # Return the predicted adjustment value
