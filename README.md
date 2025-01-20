# usdt marktet place

-- Trigger function for OffRampTransaction inserts
CREATE OR REPLACE FUNCTION off_ramp_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO combined_transactions (
        transaction_type, user_id, transaction_id, reference_id, from_currency, to_currency,
        chain, status, customer_id, from_amount, to_amount, rate, tx_hash, tx_status,
        transaction_date, deposit_address, fiat_account_id, payout_id
    )
    VALUES (
        'off_ramp', NEW.user_id, NEW.transaction_id, NEW.reference_id, NEW.from_currency, NEW.to_currency,
        NEW.chain, NEW.status, NEW.customer_id, NEW.from_amount, NEW.to_amount, NEW.rate, NEW.tx_hash, NEW.tx_status,
        CURRENT_TIMESTAMP, NULL, NEW.fiat_account_id, NEW.payout_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for OffRampTransaction
CREATE TRIGGER off_ramp_after_insert
AFTER INSERT ON off_ramp_transactions
FOR EACH ROW EXECUTE FUNCTION off_ramp_trigger_func();

-- Trigger function for OnRampTransaction inserts
CREATE OR REPLACE FUNCTION on_ramp_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO combined_transactions (
        transaction_type, user_id, transaction_id, reference_id, from_currency, to_currency,
        chain, status, customer_id, from_amount, to_amount, rate, tx_hash, tx_status,
        transaction_date, payment_method_type, deposit_address, phone, amount_transferred, fiat_account_id, payout_id
    )
    VALUES (
        'on_ramp', NEW.user_id, NEW.transaction_id, NEW.reference_id, NEW.from_currency, NEW.to_currency,
        NEW.chain, NEW.status, NEW.customer_id, NEW.from_amount, NEW.to_amount, NEW.rate, NEW.tx_hash, NEW.tx_status,
        CURRENT_TIMESTAMP, NEW.payment_method_type, NEW.deposit_address, NEW.phone, NEW.amount_transferred, NULL, NULL
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for OnRampTransaction
CREATE TRIGGER on_ramp_after_insert
AFTER INSERT ON on_ramp_transactions
FOR EACH ROW EXECUTE FUNCTION on_ramp_trigger_func();
