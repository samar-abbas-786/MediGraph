import { Suspense } from "react";
import Loading from "@/components/loading";
import VerifyEmailClient from "./VerifyEmailClient";

export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyEmailClient />
    </Suspense>
  );
}
