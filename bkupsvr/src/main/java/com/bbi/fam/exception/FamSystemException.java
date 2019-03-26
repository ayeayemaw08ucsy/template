package com.bbi.fam.exception;

public class FamSystemException extends RuntimeException {
	/** Serial Version UID. */
	private static final long serialVersionUID = -8056789144979507587L;

	/**
	 * Constructs an <code>FamSystemException</code> with the specified message and
	 * root cause.
	 * 
	 * @param message
	 *            the detail message
	 * @param t
	 *            root cause
	 */
	public FamSystemException(String message, Throwable t) {
		super(message, t);
	}

	/**
	 * Constructs an <code>FamSystemException</code> with the specified message.
	 * 
	 * @param message
	 *            the detail message
	 */
	public FamSystemException(String message) {
		super(message);
	}
}
