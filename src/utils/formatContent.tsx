export const formatContent = (content: string): React.JSX.Element[] => {
  return content.split("\n").map((line, index) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <h4
          key={index}
          className="text-sm font-semibold text-gray-900 mt-5 mb-1.5 first:mt-0"
        >
          {line.replace(/\*\*/g, "")}
        </h4>
      );
    }

    if (line.startsWith("- **")) {
      const parts = line.split("**");
      return (
        <div key={index} className="flex gap-2 ml-1 mb-1.5">
          <span className="text-gray-300 mt-px">·</span>
          <div>
            <span className="font-medium text-gray-900">{parts[1]}</span>
            <span className="text-gray-600">{parts[2]}</span>
          </div>
        </div>
      );
    }

    if (line.startsWith("- ")) {
      return (
        <div key={index} className="flex gap-2 ml-1 mb-1">
          <span className="text-gray-300 mt-px">·</span>
          <span className="text-gray-600">{line.substring(2)}</span>
        </div>
      );
    }

    if (line.trim() === "") {
      return <div key={index} className="h-1.5" />;
    }

    return (
      <p key={index} className="text-gray-600 mb-1.5 leading-relaxed">
        {line}
      </p>
    );
  });
};
