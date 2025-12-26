import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords, image }) => {
    const location = useLocation();

    useEffect(() => {
        // Update Title
        const baseTitle = 'Cutora Fresh';
        const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
        document.title = fullTitle;

        // Update Description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description || 'Cutora Fresh - Premium fresh meat and seafood delivery. Hygienically processed and daily sourced.');
        }

        // Update Keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', keywords || 'fresh meat, seafood, chicken, delivery, hygienic meat');

        // Update OG Tags
        const updateOGTag = (property, content) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            if (content) tag.setAttribute('content', content);
        };

        updateOGTag('og:title', fullTitle);
        updateOGTag('og:description', description);
        updateOGTag('og:url', window.location.href);
        if (image) updateOGTag('og:image', image);

    }, [title, description, keywords, image, location]);

    return null;
};

export default SEO;
