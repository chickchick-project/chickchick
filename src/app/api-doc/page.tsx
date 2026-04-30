import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function Page() {
  return (
    <div className="h-screen">
      <SwaggerUI
        url="/api/doc"
        deepLinking={true}
        displayRequestDuration={true}
      />
    </div>
  );
}
