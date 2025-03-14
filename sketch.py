import pygame
import math
import matplotlib.pyplot as plt
import numpy as np

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

m1 = 1  
m2 = 100  
v1 = 0 
v2 = -1  
x1 = 200 
x2 = 400

collision_count = 0
momentum_list = []
energy_list = []
trajectory_x = []
trajectory_y = []

def elastic_collision(m1, v1, m2, v2):
    """Compute velocities after a 1D elastic collision."""
    new_v1 = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2)
    new_v2 = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2)
    return new_v1, new_v2

running = True
while running:
    screen.fill(BACKGROUND_COLOR)
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Collision with wall
    if x1 <= 50:
        v1 = -v1
        collision_count += 1  

    # Collision between masses
    if x1 + 40 >= x2:
        v1, v2 = elastic_collision(m1, v1, m2, v2)
        collision_count += 1  

    x1 += v1
    x2 += v2

    x_transformed = math.sqrt(m1) * v1
    y_transformed = math.sqrt(m2) * v2
    trajectory_x.append(x_transformed)
    trajectory_y.append(y_transformed)

    pygame.draw.rect(screen, WALL_COLOR, (50, 100, 5, 200))
    pygame.draw.circle(screen, BALL_COLOR, (int(x1), HEIGHT // 2), 20)
    pygame.draw.circle(screen, BIG_BALL_COLOR, (int(x2), HEIGHT // 2), 40)

    text_surface = font.render(f"Collisions: {collision_count}", True, TEXT_COLOR)
    screen.blit(text_surface, (50, 50))

    pygame.display.flip()
    clock.tick(60)

pygame.quit()

# Plot the momentum-energy circular path
plt.figure(figsize=(6, 6))
circle = plt.Circle((0, 0), np.sqrt(m1 + m2), color='yellow', fill=False, linewidth=2)
ax = plt.gca()
ax.add_patch(circle)
plt.plot(trajectory_x, trajectory_y, 'r-', linewidth=2) 
plt.plot(trajectory_x[-1], trajectory_y[-1], 'ro', markersize=6)  
plt.axhline(0, color='white', linewidth=1)
plt.axvline(0, color='white', linewidth=1)
plt.xlabel("$x = \sqrt{m_1} v_1$")
plt.ylabel("$y = \sqrt{m_2} v_2$")
plt.title("Momentum vs Energy (Circular Path)")
plt.grid(True, linestyle="--", linewidth=0.5)
plt.show()
