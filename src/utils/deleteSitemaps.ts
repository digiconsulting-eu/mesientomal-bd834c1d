import { supabase } from '@/integrations/supabase/client';

export const deleteSitemaps = async () => {
  const sitemapFiles = [
    'sitemap.xml',
    'sitemap-static.xml',
    'sitemap-patologias.xml',
    'sitemap-patologias-1.xml',
    'sitemap-patologias-2.xml',
    'sitemap-patologias-3.xml',
    'sitemap-patologias-4.xml',
    'sitemap-patologias-5.xml',
    'sitemap-reviews.xml'
  ];

  for (const file of sitemapFiles) {
    const { error } = await supabase
      .storage
      .from('public')
      .remove([file]);
    
    if (error) {
      console.error(`Error deleting ${file}:`, error);
    } else {
      console.log(`Successfully deleted ${file}`);
    }
  }
};

// Execute the deletion
deleteSitemaps();