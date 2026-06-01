# XAMPP & Database Setup Instructions

This guide explains how to set up the MySQL database using XAMPP for the Imposter Hunt backend.

## 1. Installing XAMPP
1. Download XAMPP for Windows from [Apache Friends](https://www.apachefriends.org/index.html).
2. Run the installer. You only strictly need **Apache** and **MySQL**, but default settings are fine.
3. Finish the installation and launch the **XAMPP Control Panel**.

## 2. Starting Apache and MySQL
1. Open the **XAMPP Control Panel**.
2. Click the **Start** button next to **Apache**. Wait for the text to turn green.
3. Click the **Start** button next to **MySQL**. Wait for the text to turn green.

## 3. Opening phpMyAdmin
1. Once both services are running, open your web browser.
2. Navigate to `http://localhost/phpmyadmin`. This is the web interface for managing your MySQL server.

## 4. Creating the Database
1. In phpMyAdmin, click on the **Databases** tab at the top.
2. Under **Create database**, enter `imposter_hunt` as the Database name.
3. Select `utf8mb4_general_ci` or `utf8mb4_unicode_ci` as the Collation.
4. Click **Create**.

## 5. Running SQL Scripts
1. Select the newly created `imposter_hunt` database from the left sidebar.
2. Click on the **SQL** tab at the top.
3. Open the file `backend/database/schema.sql` that was generated in this project.
4. Copy the entire contents of `schema.sql` and paste it into the SQL text box in phpMyAdmin.
5. Click the **Go** button at the bottom right.

## 6. Verifying Tables
1. After the query executes successfully, refresh the page or click on the `imposter_hunt` database in the left sidebar again.
2. You should see 12 tables listed:
   - `achievements`
   - `chat_messages`
   - `clues`
   - `game_history`
   - `games`
   - `leaderboard`
   - `room_players`
   - `rooms`
   - `rounds`
   - `user_achievements`
   - `users`
   - `votes`

The database is now set up and ready to be used by the Node.js backend!
