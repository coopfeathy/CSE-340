-- Insert a new account record
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
) VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
);

-- Upgrade an account to 'Admin' based on email
UPDATE public.account
SET 
    account_type = 'Admin'
WHERE 
    account_email = 'tony@starkent.com';

-- Delete an account based on email
DELETE 
FROM public.account 
WHERE 
    account_email = 'tony@starkent.com';

-- Update the description in the inventory
UPDATE public.inventory
SET 
    inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE 
    inv_make = 'GM' 
    AND inv_model = 'Hummer';

-- Select inventory items that are classified as 'Sport'
SELECT 
    inv.inv_make,
    inv.inv_model,
    cl.classification_name
FROM 
    public.inventory inv
INNER JOIN public.classification cl ON inv.classification_id = cl.classification_id
WHERE 
    cl.classification_name = 'Sport';

-- Update image paths in the inventory
UPDATE public.inventory
SET 
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/'),
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/');
