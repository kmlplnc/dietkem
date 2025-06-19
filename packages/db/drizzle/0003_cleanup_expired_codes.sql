-- Cleanup function for expired verification codes
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM "email_verification_codes" 
  WHERE "expires_at" < NOW() OR "used" = 'true';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup every hour (optional)
-- This requires pg_cron extension to be installed
-- SELECT cron.schedule('cleanup-expired-codes', '0 * * * *', 'SELECT cleanup_expired_verification_codes();');

-- Manual cleanup command (can be run periodically)
-- SELECT cleanup_expired_verification_codes(); 