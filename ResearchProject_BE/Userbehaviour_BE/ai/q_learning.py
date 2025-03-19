# q_learning.py

# Define states and actions
states = ["small_font", "medium_font", "large_font", "zoomed_out", "zoomed_in"]
actions = ["increase_font", "decrease_font", "increase_zoom", "decrease_zoom"]

# Q-table for Q-learning (stores Q-values for state-action pairs)
q_table = {}

# Initialize Q-table with default values (zero for simplicity)
for state in states:
    for action in actions:
        q_table[(state, action)] = 0

# Update Q-table based on the state-action pair and reward
def update_q_table(q_table, state, action, reward, next_state):
    learning_rate = 0.1
    discount_factor = 0.9

    # Get the current Q value for the state-action pair
    current_q = q_table.get((state, action), 0)

    # Find the maximum Q value for the next state (next possible actions)
    max_next_q = max([q_table.get((next_state, a), 0) for a in actions])

    # Update the Q value using the Q-learning formula
    q_table[(state, action)] = current_q + learning_rate * (reward + discount_factor * max_next_q - current_q)
    return q_table
