"use client";

interface Participant {
  id: string;
  name: string;
  isYou?: boolean;
  isScreenSharing?: boolean;
}

interface VideoGridProps {
  participants: Participant[];
  userName: string;
  cameraOff: boolean;
  isScreenSharing: boolean;
  screenShareParticipant?: Participant;
}

export default function VideoGrid({
  participants,
  userName,
  cameraOff,
  isScreenSharing,
  screenShareParticipant,
}: VideoGridProps) {
  if (isScreenSharing && screenShareParticipant) {
    return (
      <div className="flex-1 flex flex-col gap-4 p-4 bg-gradient-to-br from-background to-secondary overflow-auto">
        {/* Screen Share Main View */}
        <div className="flex-1 rounded-xl overflow-hidden border-2 border-primary/50 bg-black">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="w-20 h-20 text-primary/50"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-8-3l-4-5h3V6h2v3h3l-4 5z" />
              </svg>
              <p className="text-muted-foreground">
                {screenShareParticipant.name}'s screen
              </p>
            </div>
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-32">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden border border-border aspect-video"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {cameraOff && participant.isYou ? (
                  <div className="flex items-center justify-center w-full h-full">
                    <svg
                      className="w-6 h-6 text-primary/50"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                    {participant.name[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-xs text-white">
                {participant.name.split(" ")[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const gridCols =
    participants.length <= 1
      ? 1
      : participants.length <= 4
        ? 2
        : participants.length <= 9
          ? 3
          : 4;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-background to-secondary overflow-auto">
      <div
        className={`grid gap-2 sm:gap-4 w-full h-full grid-cols-1 sm:grid-cols-2 ${
          participants.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"
        } auto-rows-fr`}
      >
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg sm:rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all group"
          >
            {/* Video Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />

            {/* Placeholder Video */}
            <div className="w-full h-full flex items-center justify-center">
              {cameraOff && participant.isYou ? (
                <div className="flex flex-col items-center gap-2 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M3 21v-2a6 6 0 0112 0v2" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Camera off
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                    {participant.name[0]?.toUpperCase()}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground text-center px-2">
                    {participant.name}
                  </span>
                </div>
              )}
            </div>

            {/* Badge */}
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
              {participant.isYou && (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="hidden sm:inline">You</span>
                </>
              )}
            </div>

            {/* Audio Indicator */}
            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
              <svg
                className="w-3 h-3 text-green-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
