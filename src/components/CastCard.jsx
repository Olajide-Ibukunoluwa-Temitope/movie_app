import Image from "next/image";

export default function CastCard({ actor }) {
  return (
    <div
      key={actor.id}
      className="bg-gray-800 rounded-lg h-full overflow-hidden shadow-lg"
    >
      <div className="relative h-fit">
        <Image
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
              : "/images/placeholder_img.png"
          }
          alt={actor.name}
          width={192}
          height={286}
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-xl">{actor.character}</h3>
        <h5 className="text-sm">{actor.name}</h5>
      </div>
    </div>
  );
}
