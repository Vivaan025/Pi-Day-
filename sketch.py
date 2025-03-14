import pygame
import math
import matplotlib.pyplot as plt

# Pygame setup
WIDTH, HEIGHT = 800, 400
BACKGROUND_COLOR = (30, 30, 30)
BALL_COLOR = (0, 255, 0)
BIG_BALL_COLOR = (255, 0, 0)
WALL_COLOR = (255, 255, 255)
TEXT_COLOR = (255, 255, 255)

pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Physics setup
m1 = 1  # Small mass
m2 = 100  # Large mass (try powers of 100 for more pi digits)
v1 = 0  # Initial velocity of small mass
v2 = -1  # Initial velocity of large mass
x1 = 200  # Initial position of small mass
x2 = 400  # Initial position of large mass

collision_count = 0
momentum_list = []
energy_list = []

def elastic_collision(m1, v1, m2, v2):
    """Compute velocities after a 1D elastic collision."""
    new_v1 = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2)
    new_v2 = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2)
    return new_v1, new_v2

running = True
while running:
    screen.fill(BACKGROUND_COLOR)
    
    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Collision with wall
    if x1 <= 50:
        v1 = -v1
        collision_count += 1  # Count wall collision

    # Collision between masses
    if x1 + 40 >= x2:
        v1, v2 = elastic_collision(m1, v1, m2, v2)
        collision_count += 1  # Count mass collision

    # Update positions
    x1 += v1
    x2 += v2

    # Compute momentum and energy
    momentum = m1 * v1 + m2 * v2
    energy = 0.5 * m1 * v1**2 + 0.5 * m2 * v2**2
    momentum_list.append(momentum)
    energy_list.append(energy)

    # Draw elements
    pygame.draw.rect(screen, WALL_COLOR, (50, 100, 5, 200))  # Wall
    pygame.draw.circle(screen, BALL_COLOR, (int(x1), HEIGHT // 2), 20)  # Small mass
    pygame.draw.circle(screen, BIG_BALL_COLOR, (int(x2), HEIGHT // 2), 40)  # Large mass

    # Display collision count
    text_surface = font.render(f"Collisions: {collision_count}", True, TEXT_COLOR)
    screen.blit(text_surface, (50, 50))

    pygame.display.flip()
    clock.tick(60)

pygame.quit()

# Plot momentum vs energy (should form a circular trajectory)
plt.figure(figsize=(6, 6))
plt.plot(momentum_list, energy_list, 'bo-', markersize=3, linewidth=1)
plt.xlabel("Momentum (p)")
plt.ylabel("Energy (E)")
plt.title("Momentum vs Energy (Circular Path)")
plt.grid(True)
plt.show()
