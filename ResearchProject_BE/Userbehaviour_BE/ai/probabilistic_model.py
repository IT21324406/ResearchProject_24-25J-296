# # probabilistic_model.py
# import torch
# import torch.nn as nn
# import torch.optim as optim

# class SimpleBayesianNetwork(nn.Module):
#     def __init__(self):
#         super(SimpleBayesianNetwork, self).__init__()
#         # Simple feed-forward layers for Bayesian-like logic
#         self.layer1 = nn.Linear(3, 10)  # Input size 2 (zoom and font), output size 10
#         self.layer2 = nn.Linear(10, 1)  # Output size 1 (predicted adjustment)

#     def forward(self, x):
#         x = torch.relu(self.layer1(x))
#         x = self.layer2(x)
#         return x

# def build_bayesian_network():
#     model = SimpleBayesianNetwork()
#     return model

# # def make_prediction(model, zoom_level, font_size, scroll_speed):
# #     # Input: [zoom_level, font_size]
# #     input_data = torch.tensor([[zoom_level, font_size, scroll_speed]], dtype=torch.float32)
# #     output = model(input_data)
# #     return output.item()  # Return the predicted adjustment value


# def make_prediction(model, zoom_level, font_size, scroll_speed, inactivity_time):
#     """
#     Predict UI adjustment based on zoom level, font size, scroll speed, and inactivity time.
#     """
#     input_data = torch.tensor([[zoom_level, font_size, scroll_speed, inactivity_time]], dtype=torch.float32)  # Now using 4 inputs
#     output = model(input_data)
#     return output.item()    

import torch
import torch.nn as nn

class SimpleBayesianNetwork(nn.Module):
    def __init__(self):
        super(SimpleBayesianNetwork, self).__init__()
        self.layer1 = nn.Linear(4, 10)  # Change from 3 to 4 inputs
        self.layer2 = nn.Linear(10, 1)  # Output layer

    def forward(self, x):
        x = torch.relu(self.layer1(x))
        x = self.layer2(x)
        return x

def build_bayesian_network():
    model = SimpleBayesianNetwork()
    return model

def make_prediction(model, zoom_level, scroll_speed, inactivity_time, font_size):
    input_data = torch.tensor([[zoom_level, scroll_speed, inactivity_time, font_size]], dtype=torch.float32)
    output = model(input_data)
    return output.item()  # Convert tensor to scalar value
        


        