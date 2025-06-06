# backend/seed.py
import logging
from sqlalchemy.orm import Session

from database import database, models
from crud import crud_menu, crud_user
from schemas import menu as menu_schemas
from schemas import user as user_schemas
from core.config import settings # For any config needed during seeding

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- IMPORTANT --- 
# Replace this with the actual data from your src/data/menu.ts file,
# converted to a Python list of dictionaries.
# Ensure the 'id' field is a string if your MenuItem model expects a string ID.
MENU_DATA_TS_EQUIVALENT = [
    {
        "id": "pizza-calabresa", # String ID
        "name": "Pizza Calabresa",
        "description": "Molho de tomate, calabresa fatiada, cebola e azeitonas.",
        "price": 30.00,
        "category": "Pizzas Tradicionais",
        "imageUrl": "/images/pizzas/calabresa.png"
    },
    {
        "id": "pizza-marguerita", # String ID
        "name": "Pizza Marguerita",
        "description": "Molho de tomate, mussarela, tomate fresco e manjericão.",
        "price": 28.00,
        "category": "Pizzas Tradicionais",
        "imageUrl": "/images/pizzas/marguerita.png"
    },
    {
        "id": "pizza-portuguesa", # String ID
        "name": "Pizza Portuguesa",
        "description": "Molho de tomate, mussarela, presunto, ovo, cebola, pimentão e azeitonas.",
        "price": 32.50,
        "category": "Pizzas Tradicionais",
        "imageUrl": "/images/pizzas/portuguesa.png"
    },
    {
        "id": "coca-cola-2l", # String ID
        "name": "Coca-Cola 2L",
        "description": "Refrigerante Coca-Cola garrafa 2 litros.",
        "price": 10.00,
        "category": "Bebidas",
        "imageUrl": "/images/bebidas/coca-cola-2l.png"
    },
    {
        "id": "agua-mineral-500ml", # String ID
        "name": "Água Mineral 500ml",
        "description": "Água mineral sem gás, garrafa 500ml.",
        "price": 3.00,
        "category": "Bebidas",
        "imageUrl": "/images/bebidas/agua-mineral.png"
    },
    # Add more items as needed, matching the structure from menu.ts
]

# Initial admin user (optional)
INITIAL_ADMIN_USER = {
    "email": "admin@example.com",
    "password": "adminpassword123" # Change this in a real scenario!
}

def seed_menu_items(db: Session):
    logger.info("Seeding menu items...")
    existing_item_ids = {item.id for item in crud_menu.get_menu_items(db, limit=len(MENU_DATA_TS_EQUIVALENT) + 10)}
    
    for item_data in MENU_DATA_TS_EQUIVALENT:
        if item_data["id"] not in existing_item_ids:
            menu_item_in = menu_schemas.MenuItemCreate(**item_data)
            crud_menu.create_menu_item(db, menu_item_in)
            logger.info(f"Created menu item: {menu_item_in.name}")
        else:
            logger.info(f"Menu item '{item_data['name']}' (ID: {item_data['id']}) already exists, skipping.")
    logger.info("Menu items seeding finished.")

def seed_initial_user(db: Session):
    logger.info("Seeding initial user...")
    user = crud_user.get_user_by_email(db, email=INITIAL_ADMIN_USER["email"])
    if not user:
        user_in = user_schemas.UserCreate(
            email=INITIAL_ADMIN_USER["email"],
            password=INITIAL_ADMIN_USER["password"]
        )
        crud_user.create_user(db, user_in)
        logger.info(f"Created initial user: {user_in.email}")
    else:
        logger.info(f"User '{INITIAL_ADMIN_USER['email']}' already exists, skipping.")
    logger.info("Initial user seeding finished.")

def init_db(db: Session):
    # Create tables. This is also in main.py, but can be useful here for standalone seeding.
    # In a production setup, Alembic would handle migrations.
    models.Base.metadata.create_all(bind=database.engine)
    
    seed_menu_items(db)
    seed_initial_user(db) # Optional: seed an initial admin user

def main():
    logger.info("Starting database seeding process...")
    db = database.SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    logger.info("Database seeding process finished.")

if __name__ == "__main__":
    # This allows running the script directly: python seed.py
    # Ensure your .env file is in the same directory or accessible
    # when running this script, as core.config will try to load it.
    main()
