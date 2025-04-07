import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To RomisArtsShop',
  description: 'We sell the best products for art, frames, and gallery at affordable prices',
  keywords: 'art, frames, gallery, buy art, affordable art',
};

export default Meta;