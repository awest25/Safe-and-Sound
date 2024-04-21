export default function AirbnbWidget({ listing }) {
    return (
      <div 
        className="airbnb-embed-frame" 
        data-id={listing.id} 
        data-view="home" 
        data-hide-price="true" 
        style={{ width: '450px', height: '300px' }}
      >
        <a href={`https://www.airbnb.com/rooms/${listing.id}?guests=1&adults=1&s=66&source=embed_widget`}>
          View On Airbnb
        </a>
        <a 
          href={`https://www.airbnb.com/rooms/${listing.id}?guests=1&adults=1&s=66&source=embed_widget`}
          rel="nofollow"
        >
          {listing.name}
        </a>
        <script async src="https://www.airbnb.com/embeddable/airbnb_jssdk"></script>
      </div>
    );
  }
  